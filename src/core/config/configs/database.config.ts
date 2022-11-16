export abstract class DataBaseConfig {
  abstract get host(): string;
  abstract get port(): number;
  abstract get database(): string;
  abstract get user(): string;
  abstract get password(): string;
}
