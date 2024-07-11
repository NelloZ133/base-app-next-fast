export interface ILineResponse {
  lines: Line[];
}

export type Line = {
  line_id: number | null;
  line_name: string | null;
  line_fullname: string | null;
  line_code: string | null;
  work_center_code: string | null;
  process_code: string | null;
  line_group: string | null;
  group_type: string | null;
  section_id: number | null;
};

export interface IPositionResponse {
  positions: Position[];
}

export type Position = {
  position_id: number | null;
  position_name: string | null;
  position_shortname: string | null;
  position_level: string | null;
  position_group: string | null;
};

export interface ISectionResponse {
  sections: Section[];
}

export type Section = {
  section_id: number | null;
  section_code: string | null;
  section_name: string | null;
  sub_section_name: string | null;
  department: string | null;
  sub_department: string | null;
  division: string | null;
  company: string | null;
  plant: string | null;
  group_type: string | null;
};
