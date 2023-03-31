export type AssetImage = {
  url: string;
  imgSrc: string;
  name: string;
};

export type Curriculum = {
  difficulty: number;
  word: string;
  missingLetterCount: number;
};

export type Balloon = {
  type: string;
  position: string;
  name: string;
};

export type Asset = {
  bundleUrl: string;
  balloons: Balloon[];
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

export type AssignmentsMap = { [key: string]: string | undefined };