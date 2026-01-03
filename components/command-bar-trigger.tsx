"use client";

export function CommandBarTrigger() {
  const handleClick = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <button
      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground text-xs transition-all duration-200 border border-border/30 hover:border-border/50 hover:shadow-lg hover:shadow-primary/5"
      onClick={handleClick}
    >
      <span>Quick actions</span>
      <div className="flex items-center gap-0.5">
        <kbd className="kbd">⌘</kbd>
        <kbd className="kbd">K</kbd>
      </div>
    </button>
  );
}
