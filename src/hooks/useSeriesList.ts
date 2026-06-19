import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { AnimeSeries, Episode, defaultEpisodeStatus } from "../types";

const COL = "series";

export function useSeriesList() {
  const [series, setSeries] = useState<AnimeSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Order only by explicit `order` field to avoid requiring a composite index.
    const q = query(collection(db, COL), orderBy("order", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: AnimeSeries[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AnimeSeries, "id">),
        }));
        setSeries(list);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError(err?.message ?? "Failed to load series");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addSeries = async (
    name: string,
    episodeCount: number,
    userEmail: string
  ) => {
    const episodes: Record<number, Episode> = {};
    for (let i = 1; i <= episodeCount; i++) {
      episodes[i] = { id: i, status: defaultEpisodeStatus() };
    }
    await addDoc(collection(db, COL), {
      name,
      episodeCount,
      episodes,
      createdBy: userEmail,
      createdAt: Date.now(),
      order: Date.now(), // default ordering
      lastModifiedBy: userEmail,
      lastModifiedAt: Date.now(),
    });
  };

  const deleteSeries = async (id: string) => {
    await deleteDoc(doc(db, COL, id));
  };

  const setSeriesOrder = async (orderedIds: string[]) => {
    if (!orderedIds || orderedIds.length === 0) return;
    const batch = writeBatch(db);
    orderedIds.forEach((id, idx) => {
      batch.update(doc(db, COL, id), { order: idx });
    });
    await batch.commit();
  };

  const moveSeries = async (seriesId: string, direction: -1 | 1) => {
    const idx = series.findIndex((s) => s.id === seriesId);
    if (idx === -1) return;
    const target = idx + direction;
    if (target < 0 || target >= series.length) return;
    const ids = series.map((s) => s.id);
    // swap
    const tmp = ids[target];
    ids[target] = ids[idx];
    ids[idx] = tmp;
    await setSeriesOrder(ids);
  };

  const updateEpisodeStatus = async (
    seriesId: string,
    episodeNum: number,
    field: string,
    value: string,
    userEmail: string,
    currentEpisodes: Record<number, Episode>
  ) => {
    const updated = {
      ...currentEpisodes,
      [episodeNum]: {
        ...currentEpisodes[episodeNum],
        status: {
          ...currentEpisodes[episodeNum].status,
          [field]: value,
        },
        lastModifiedBy: userEmail,
        lastModifiedAt: Date.now(),
      },
    };
    await updateDoc(doc(db, COL, seriesId), {
      episodes: updated,
      lastModifiedBy: userEmail,
      lastModifiedAt: Date.now(),
    });
  };

  const batchUpdateEpisodes = async (
    seriesId: string,
    start: number,
    end: number,
    field: string,
    value: string,
    userEmail: string,
    currentEpisodes: Record<number, Episode>
  ) => {
    if (start < 1) start = 1;
    if (end < start) return;
    const updated = { ...currentEpisodes } as Record<number, Episode>;
    for (let i = start; i <= end; i++) {
      updated[i] = {
        ...(updated[i] ?? { id: i, status: defaultEpisodeStatus() }),
        status: {
          ...((updated[i] && updated[i].status) || defaultEpisodeStatus()),
          [field]: value,
        },
        lastModifiedBy: userEmail,
        lastModifiedAt: Date.now(),
      };
    }
    await updateDoc(doc(db, COL, seriesId), {
      episodes: updated,
      lastModifiedBy: userEmail,
      lastModifiedAt: Date.now(),
    });
  };

  const changeEpisodeCount = async (
    seriesId: string,
    newCount: number,
    currentEpisodes: Record<number, Episode>,
    userEmail: string
  ) => {
    if (newCount < 1) return;
    const updated: Record<number, Episode> = {};
    for (let i = 1; i <= newCount; i++) {
      updated[i] = currentEpisodes[i] ?? {
        id: i,
        status: defaultEpisodeStatus(),
      };
    }
    await updateDoc(doc(db, COL, seriesId), {
      episodeCount: newCount,
      episodes: updated,
      lastModifiedBy: userEmail,
      lastModifiedAt: Date.now(),
    });
  };

  return {
    series,
    loading,
    error,
    addSeries,
    deleteSeries,
    updateEpisodeStatus,
    changeEpisodeCount,
    setSeriesOrder,
    moveSeries,
    batchUpdateEpisodes,
  };
}
