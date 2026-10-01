/**
 * Keeps hyphenated Latin words such as NarraLeaf-React on one line.
 *
 * Browsers may break a line after a hyphen, which in a large heading splits a
 * product name in two. Only the hyphenated words are held together; everything
 * else, Chinese included, still wraps where it normally would.
 */
export function KeepHyphenated(props: { text: string }) {
  return props.text
    .split(/([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)/)
    .map((part, index) =>
      index % 2 === 1 ? (
        <span key={index} className="whitespace-nowrap">
          {part}
        </span>
      ) : (
        part
      ),
    );
}
