export type TopKItem = { label: string; index: number; prob: number };
export type PredictResponse = { topk: TopKItem[]; best: TopKItem; count_classes: number };

