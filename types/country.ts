
export type StateCountryType = {
  code: string;
  name: string;
}

export type CountryType = StateCountryType & {states: StateCountryType[]};