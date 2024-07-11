import { Line, Position, Section } from "@/types";

export interface ISettingState {
  lines: Line[];
  positions: Position[];
  sections: Section[];

  setLines: (lines: Line[]) => void;
  setPositions: (positions: Position[]) => void;
  setSections: (sections: Section[]) => void;

  fetchSettings: () => void;
}
