import { of } from "rxjs";
import { filter, tap, switchMap, takeUntil, delay } from "rxjs/operators";

function repeatEpic(events$, start) {
  return events$.pipe(
    filter((e) => e.type === "repeat"),
    switchMap((action) =>
      of(2000).pipe(
        delay(2000),
        tap(() => start()),
        takeUntil(events$.pipe(filter((e) => e.type === "stop_repeat")))
      )
    )
  );
}

export default repeatEpic;
