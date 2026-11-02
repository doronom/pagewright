import Callout from '../components/Callout.astro';
import CodeBlock from '../components/CodeBlock.astro';
import CodePre from '../components/CodePre.astro';
import Diagram from '../components/Diagram.astro';
import RepoCode from '../components/RepoCode.astro';
import TableWrap from '../components/TableWrap.astro';

/** Components available in every MDX file without an import, plus element overrides. */
export const mdxComponents = {
  pre: CodePre,
  table: TableWrap,
  Callout,
  CodeBlock,
  Diagram,
  RepoCode,
};
