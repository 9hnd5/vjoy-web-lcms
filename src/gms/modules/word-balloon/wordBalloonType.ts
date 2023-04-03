import { Asset } from "gms/services/lessonService";

export type AssetImage = {
  url: string;
  imgSrc: string;
  name: string;
};

export type FormType = {
  id?: number;
  status: number;
  curriculum: FileList;
  unitId: number;
  name: string;
  gameType: string;
  difficulty: number;
  behavior: number;
  asset: Asset;
};

export type AssignmentsMap = { [key: string]: string | undefined };
