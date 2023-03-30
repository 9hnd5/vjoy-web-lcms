export type AssetImage = { url: string; imgSrc: string };
export type Curriculum = {
  difficulty: number;
  word: string;
  missingLetterCount: number;
};
export type Asset = {
  bundleUrl: string;
  balloons: {
    type: string;
    position: string;
    name: string;
  }[];
  bg: string;
  cannon: string;
  behavior: number;
};
export type FormType = {
  curriculum: FileList;
  unitId: number;
  name: string;
  gameType: string;
  difficulty: number;
};
