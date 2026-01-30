import { addPrefixIfNonEmpty, getListNamespace } from '@/utils/lists';
import { IAppConfig, ListName } from './interfaces';

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

  public static getValue(namespace: string, defaultValue: any = []) {
    const store = localStorage.getItem(namespace);

    return (store && JSON.parse(store)) || defaultValue;
  }

  public static setValue(namespace: string, value: unknown) {
    localStorage.setItem(namespace, JSON.stringify(value));
  }

  public static getAllData<K extends string>(
    lists: ListName[],
    config: IAppConfig,
    configNamespace: string
  ): Record<K, unknown> {
    const entries = lists.map((list: ListName) => {
      const namespace = getListNamespace(list);
      const listData = Utils.getValue(addPrefixIfNonEmpty(namespace, config.storePrefix));

      return [namespace, listData];
    });

    const { storePrefix, ...settings } = config;

    entries.unshift([configNamespace, settings]);

    return Object.fromEntries(entries);
  }

  public static saveAllData<K extends string>(
    data: Record<K, unknown>,
    config: IAppConfig,
    configNamespace: string
  ) {
    const entries = Object.entries(data || {});

    entries.forEach(([namespace, value]) => {
      if (namespace === configNamespace) {
        delete (value as IAppConfig).storePrefix;
      }
      Utils.setValue(addPrefixIfNonEmpty(namespace, config.storePrefix), value);
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
