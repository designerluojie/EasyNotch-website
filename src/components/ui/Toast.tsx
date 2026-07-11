type Props = { message: string; tone?: "success" | "error" };

export function Toast({ message, tone = "success" }: Props) {
  return (
    <div className={`site-toast site-toast--${tone}`} role="status">
      <span aria-hidden="true">{tone === "success" ? "✓" : "!"}</span>
      {message}
    </div>
  );
}

