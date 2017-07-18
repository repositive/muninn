export function filterPayload<T>({payload}: {payload?: T}): Promise<T> {
  if (payload) {
    return Promise.resolve(payload);
  } else {
    return Promise.reject(new Error('Invalid payload'));
  }
}

export function observe<T>(whatever: T): T {
  console.log(whatever);
  return whatever;
}

export function compose<T>(...args: any[]) {
  return (...arg: any[]): Promise<T> => {
    return args.reduce((acc: Promise<T>, f: any) => acc.then(f), Promise.resolve(arg[0]));
  };
}
