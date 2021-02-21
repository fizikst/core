import { timer, from, fromEvent, of, merge } from "rxjs";
import {
  scan,
  filter,
  tap,
  switchMap,
  mergeMap,
  map,
  takeUntil,
  defaultIfEmpty
} from "rxjs/operators";

const SOUND_URL = "http://lk.gorazd.online";

const laodAudiosEpic = (events$, handleError = () => {}) => {
  return switchMap(([args, sound]) => {
    let audios = [];
    let result$ = of([args, sound, audios]);
    if (sound) {
      args.forEach((num) => {
        const audioTarget = new Audio();
        audioTarget.src = `${SOUND_URL}/assets/sounds/numbers/${num}.ogg`;
        audios.push(audioTarget);
      });
      result$ = from(audios).pipe(
        tap((e) => console.log("audios loading", e)),
        mergeMap((target, index) => {
          console.log({ target });
          return [
            fromEvent(target, "canplaythrough").pipe(
              takeUntil(timer(5000)),
              defaultIfEmpty(index)
            )
          ];
        }),
        mergeMap((value) => {
          value.subscribe((v) => {
            if (typeof v === "number") {
              handleError(v);
            }
          });
          return value;
        }),
        scan((inc) => inc + 1, 0),
        tap((e) => console.log("загрузка файлов", e)),
        filter((inc) => inc >= args.length),
        map(() => [args, sound, audios]),
        takeUntil(events$.pipe(filter((e) => e.type === "error")))
      );
    }
    return result$;
  });
};

export default laodAudiosEpic;
