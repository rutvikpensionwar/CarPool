export default {
  get: location => {
    switch (location) {
      case 'San Jose':
        return 1001;
      case 'Fremont':
        return 1002;
      case 'Sunnyvale':
        return 1003;
      case 'Milpitas':
        return 1004;
      case 'Oakland':
        return 1005;
      default:
        return 1001;
    }
  }
};
