import {
  XwRandomProvidable,
} from '../interfaces/XwRandomProvidable';


/**
 * Random class
 */
export class XwRandom implements XwRandomProvidable
{
  /**
   * Current random provider
   */
  private _provider: XwRandomProvidable;


  /**
   * @constructor
   * @param provider Current random provider
   */
  constructor(provider: XwRandomProvidable) {
    this._provider = provider;
  }


  /**
   * Generate a random string of given length, picking characters from provided character set
   * @param length Desire length of the output random string
   * @param charset Character set to generate random string from
   * @returns The generated random string
   */
  string(length: number, charset: string): string {
    const _charsetLength = charset.length;
    if (_charsetLength <= 0) throw new Error('Character set must not be empty');

    let ret = '';
    for (let i = 0; i < length; ++i) {
      const r = this.number(0, _charsetLength - 1);
      ret += charset.charAt(r);
    }

    return ret;
  }


  /**
   * @inheritdoc
   */
  number(min: number, max: number): number {
    return this._provider.number(min, max);
  }


  /**
   * Generate a random hex string
   * @param length Desire length of the output random string
   * @returns The generated random hex string
   */
  hexString(length: number): string {
    return this.string(length, '0123456789abcdef');
  }


  /**
   * Generate a random lowercase alpha-numeric string
   * @param length Desire length of the output random string
   * @returns The generated random lowercase alpha-numeric string
   */
  lowerAlphanumString(length: number): string {
    return this.string(length, '0123456789abcdefghijklmnopqrstuvwxyz');
  }


  /**
   * Generate a random uppercase alpha-numeric string
   * @param length Desire length of the output random string
   * @returns The generated random uppercase alpha-numeric string
   */
  upperAlphanumString(length: number): string {
    return this.string(length, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }


  /**
   * Generate a random full alpha-numeric string
   * @param length Desire length of the output random string
   * @returns The generated random full alpha-numeric string
   */
  fullAlphanumString(length: number): string {
    return this.string(length, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }  
}