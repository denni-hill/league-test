export abstract class ApplicationConfig {
  abstract get environment(): string;
  abstract get port(): number;
  abstract get ip(): string;
  abstract get name(): string;
  abstract get description(): string;
  abstract get version(): string;
}
