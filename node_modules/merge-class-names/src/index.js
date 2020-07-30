export default function mergeClassNames(...args) {
  return args.reduce(
    (classList, arg) => (
      (typeof arg === 'string' || arg instanceof Array)
        ? classList.concat(arg)
        : classList
    ),
    [],
  ).filter(Boolean).join(' ');
}
