declare module "react-katex" {
  import type { ReactElement, ReactNode } from "react";

  type MathProps = {
    math: string;
    renderError?: (error: Error) => ReactNode;
  };

  export function InlineMath(props: MathProps): ReactElement;
  export function BlockMath(props: MathProps): ReactElement;
}
