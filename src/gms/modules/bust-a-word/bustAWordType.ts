import { BustAWordAsset, Curriculum } from "gms/services/lessonService";

export type FormType = {
  id?: number;
  status: number;
  curriculum: {
    name: string;
    data: Curriculum[];
  };
  unitId: number;
  name: string;
  gameType: string;
  difficulty: number;
  behavior: number;
  asset: BustAWordAsset;
  levelId: string;
  totalLines: number;
  wordArray: {
    value: boolean;
  }[];
};

export type AssignmentsMap = { [key: string]: string | undefined };
