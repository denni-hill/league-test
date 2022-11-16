import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Joi from "joi";
import { ApplicationConfig } from "../configs";
import { BaseConfigProvider } from "./base-config.provider";

@Injectable()
export class ApplicationConfigProvider
  extends BaseConfigProvider<ApplicationConfig>
  implements ApplicationConfig
{
  constructor(private readonly _configService: ConfigService) {
    super();
    this._validateConfig();
  }

  private readonly _environmentVariable = "NODE_ENV";
  get environment() {
    return (
      this._configService.get<string>(this._environmentVariable) ||
      "development"
    );
  }

  private readonly _portVariable = "PORT";
  get port() {
    return this._configService.get<number>(this._portVariable) || 3000;
  }

  private readonly _ipVariable = "HOST";
  get ip() {
    return this._configService.get<string>(this._ipVariable) || "0.0.0.0";
  }

  private readonly _nameVariable = "APPLICATION_NAME";
  get name() {
    return this._configService.get<string>(this._nameVariable) || "unknown";
  }

  private readonly _descriptionVariable = "APPLICATION_DESCRIPTION";
  get description(): string {
    return (
      this._configService.get<string>(this._descriptionVariable) ||
      `${this.name} API description`
    );
  }

  private readonly _versionVariable = "VERSION";
  get version() {
    return this._configService.get<string>(this._versionVariable) || "1.0";
  }

  protected _validatorFunction() {
    return Joi.object<ApplicationConfig, true, ApplicationConfig>({
      environment: Joi.string()
        .valid("development", "production", "test", "provision")
        .required()
        .label(this._environmentVariable),
      port: Joi.number().port().required().label(this._portVariable),
      ip: Joi.string().ip().required().label(this._ipVariable),
      name: Joi.string().required().label(this._nameVariable),
      description: Joi.string().required().label(this._descriptionVariable),
      version: Joi.string().required().label(this._versionVariable)
    }).validate(
      {
        environment: this.environment,
        port: this.port,
        ip: this.ip,
        name: this.name,
        description: this.description,
        version: this.version
      },
      { stripUnknown: true, abortEarly: false }
    );
  }
}
