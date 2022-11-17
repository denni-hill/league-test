import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Joi from "joi";
import { DataBaseConfig } from "../configs";
import { BaseConfigProvider } from "./base-config.provider";

@Injectable()
export class DataBaseConfigProvider
  extends BaseConfigProvider<DataBaseConfig>
  implements DataBaseConfig
{
  constructor(private readonly _config: ConfigService) {
    super();
    this._validateConfig();
  }

  private readonly _hostVariable = "DATABASE_HOST";
  get host() {
    return this._config.get<string>(this._hostVariable) as string;
  }

  private readonly _portVariable = "DATABASE_PORT";
  get port() {
    return this._config.get<number>(this._portVariable) as number;
  }

  private readonly _databaseVariable = "DATABASE_NAME";
  get database() {
    return this._config.get<string>(this._databaseVariable) as string;
  }

  private readonly _userVariable = "DATABASE_USER";
  get user() {
    return this._config.get<string>(this._userVariable) as string;
  }

  private readonly _passwordVariable = "DATABASE_PASSWORD";
  get password() {
    return this._config.get<string>(this._passwordVariable) as string;
  }

  protected _validatorFunction() {
    return Joi.object<DataBaseConfig, true, DataBaseConfig>({
      host: Joi.string().required().label(this._hostVariable),
      port: Joi.number().integer().required().label(this._portVariable),
      database: Joi.string().required().label(this._databaseVariable),
      user: Joi.string().required().label(this._userVariable),
      password: Joi.string().required().label(this._passwordVariable)
    }).validate(
      {
        host: this.host,
        port: this.port,
        database: this.database,
        user: this.user,
        password: this.password
      },
      { stripUnknown: true, abortEarly: false }
    );
  }
}
