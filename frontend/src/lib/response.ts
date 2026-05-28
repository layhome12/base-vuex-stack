export class Response {
  static isOk({ statusCode }: any): boolean {
    console.log(statusCode, [200, 201].includes(statusCode));
    if ([200, 201].includes(statusCode)) {
      return true;
    }

    return false;
  }
}
