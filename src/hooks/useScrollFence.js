import { useEffect } from "react";

/* Keys the browser would otherwise use to move the page. */
const SCROLL_KEYS = new Set([
  "PageDown",
  "PageUp",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  " ",
]);

/**
 * A scroll fence: the page may be read as far as `targetSelector`, but
 * no further, until `locked` goes false.
 *
 * This is deliberately not a freeze. The scratch cards sit below the
 * hero, so the visitor has to be able to scroll *to* them — what must
 * not be possible is scrolling past them before the date is revealed.
 *
 * The fence is enforced on three fronts, because any one alone leaks:
 *   • `wheel` / `touchmove` are cancelled at the boundary, which stops
 *     momentum scrolling on touch devices;
 *   • a `scroll` listener snaps back anything that got through
 *     (keyboard, scrollbar drag, find-in-page, focus jumps, restoring a
 *     reload position);
 *   • `overflow-anchor` is disabled so revealing the cards, which
 *     changes their height, cannot push the page past the fence.
 */
export default function useScrollFence(targetSelector, locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const root = document.documentElement;
    const previousAnchor = root.style.overflowAnchor;
    root.style.overflowAnchor = "none";

    /* The furthest the visitor may ever reach: the bottom of the
       section being fenced off. */
    let limit = 0;

    const measure = () => {
      const node = document.querySelector(targetSelector);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const bottom = rect.bottom + window.scrollY;

      /* The fence is where the section's bottom edge meets the bottom of
         the viewport — not where its bottom edge sits in the document.
         Stopping at the document position of the section's bottom would
         scroll the cards off the top of the screen, leaving the visitor
         looking at the next section with nothing to scratch. */
      limit = Math.max(0, Math.floor(bottom - window.innerHeight));
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    /* The hero settles, the scratch canvases paint on a timer and the
       status line appears — any of which move the boundary. Watching the
       document keeps the fence exact instead of trusting one reading
       taken before layout had finished. */
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    const remeasureIfNear = () => {
      /* Only worth the layout read when we are close to being stopped. */
      if (window.scrollY > limit - 200) measure();
    };

    const atLimit = () => {
      remeasureIfNear();
      return window.scrollY >= limit - 2;
    };

    const onWheel = (event) => {
      /* Downward intent at the fence is refused; upward is always free. */
      if (event.deltaY > 0 && atLimit()) event.preventDefault();
    };

    let lastTouchY = null;
    const onTouchStart = (event) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event) => {
      const y = event.touches[0]?.clientY;
      if (y == null || lastTouchY == null) return;
      const movingDown = y > lastTouchY;
      lastTouchY = y;
      if (movingDown && atLimit()) event.preventDefault();
    };
    const onTouchEnd = () => {
      lastTouchY = null;
    };

    const onKeyDown = (event) => {
      if (!SCROLL_KEYS.has(event.key)) return;

      const target = event.target;
      /* Never steal keys from something the visitor is actually using. */
      if (
        target instanceof HTMLElement &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      ) {
        return;
      }

      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      const settle = () => {
        measure();
        window.scrollTo({ top: limit, behavior: smooth ? "smooth" : "auto" });
      };

      if (event.key === "End") {
        /* `End` means "go to the bottom", which is exactly what the fence
           forbids — so it travels as far as the visitor is allowed. */
        event.preventDefault();
        settle();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
        return;
      }

      /* The space bar means "next page" until we are stopped, and
         "previous page" afterwards. It is only claimed at the fence. */
      if (event.key === " ") {
        if (atLimit()) {
          event.preventDefault();
          settle();
        }
        return;
      }

      if (event.key === "PageDown" || event.key === "ArrowDown") {
        if (atLimit()) {
          event.preventDefault();
          settle();
        }
      }
    };

    /* Anything that slipped past — scrollbar drag, focus, find-in-page —
       is returned to the fence. */
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (window.scrollY > limit) {
          /* Re-read first: the boundary may have moved since the last
             measurement, and using a stale one is what lets the page
             drift past by a few pixels. */
          measure();
          if (window.scrollY > limit) {
            window.scrollTo({ top: limit, behavior: "auto" });
          }
        }
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);

      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);

      root.style.overflowAnchor = previousAnchor;
    };
  }, [targetSelector, locked]);
}
