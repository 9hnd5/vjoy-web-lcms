import { Asset, Curriculum } from "gms/services/lessonService";

export type AssetImage = {
  url: string;
  imgSrc: string;
  name: string;
};

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
  asset: Asset;
  levelId: string;
};

export type AssignmentsMap = { [key: string]: string | undefined };
