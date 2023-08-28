// faz o typescript intender que todo arquivo que termine com  png pode ser importado
// assim ele para de acusar erro nas importações de imagem
declare module "*.png";

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
