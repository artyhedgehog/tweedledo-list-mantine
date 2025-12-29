import { getListNamespace } from '@/utils/lists';
import { ListName } from './interfaces';

class Utils {
  public static uuid(): string {
    /*jshint bitwise:false */
    let i, random;
    let uuid = '';

    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
    }

    return uuid;
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : `${word}s`;
  }

  public static getValue(namespace: string) {
    const store = localStorage.getItem(namespace);

    return (store && JSON.parse(store)) || [];
  }

  public static setValue(namespace: string, value: unknown) {
    localStorage.setItem(namespace, JSON.stringify(value));
  }

  /**
   * @todo Remove
   * @deprecated Use setValue and getValue
   */
  public static store(namespace: string, data?: any) {
    if (data) {
      return Utils.setValue(namespace, data);
    }

    return Utils.getValue(namespace);
  }

  public static getAllData<K extends string>(lists: ListName[]): Record<K, unknown> {
    const entries = lists.map((list: ListName) => {
      const namespace = getListNamespace(list);
      return [namespace, Utils.getValue(namespace)];
    });

    return Object.fromEntries(entries);
  }

  public static saveAllData<K extends string>(data: Record<K, unknown>) {
    const entries = Object.entries(data);

    entries.forEach(([namespace, value]) => {
      Utils.setValue(namespace, value);
    });
  }

  public static extend(...objs: any[]): any {
    const newObj: Record<string, any> = {};
    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}

export { Utils };
