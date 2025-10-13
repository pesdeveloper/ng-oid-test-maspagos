export interface BasicResponse {
  id_Suj: number;
  id_Bie: number;
  sujDeno: string;
  siBloqueOperativo: boolean;
  siBaja: boolean;
  enVerificacion: boolean;
  siComTipoGrande: boolean;
  esMoto: boolean;
  titulares: string;
  titularesAsArray: string[];
  id_Tit: number;
  id_Per_Tit: number;
  id_Bco: number;
  tipoCtaBco: string | null;
  cuentaBco: string | null;
  observacion: string | null;
  cbu: string | null;
  bco_Deno: string | null;
  codBanco: string | null;
}
