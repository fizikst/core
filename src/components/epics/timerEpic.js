import { timer } from "rxjs";
import {
  filter,
  tap,
  switchMap,
  takeUntil,
  takeWhile,
  map
} from "rxjs/operators";

const timerEpic = (events$, setInc) => {
  return switchMap(([args, sound, audios]) => {
    return timer(0, 1000).pipe(
      tap((idx) => sound && audios[idx] && audios[idx].play()),
      takeWhile((index) => index < args.length),
      // TODO можно обойтись без явного команды stop,
      // т.к. при стоп обнулсяется масссив и count становиться равным 0
      // и по условию выше и так происходит остановка !!!???
      takeUntil(events$.pipe(filter((e) => e.type === "stop"))),
      tap((inc) => setInc(inc)),
      map((inc) => [inc, args.length])
    );
  });
};

export default timerEpic;
