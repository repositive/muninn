

export default function promisify<T>(f: (...arg: any[]) => T, context?: any) {
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      args.push((err: Error, result: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });

      f.apply(context, args);
    });
  };
}
