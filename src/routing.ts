function routeConfig(url: string) {
  return {
    href: url,
    hash: url,
  } as const;
}

export const routing = {
  todos: {
    all: routeConfig('#/'),
    active: routeConfig('#/active'),
    completed: routeConfig('#/completed'),
  },
};
