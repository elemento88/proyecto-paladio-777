// Types for API-Football integration
export interface SportData {
  id: number
  name: string
  slug: string
  icon: string
  apiEndpoint: string
  isAvailable: boolean
}

// Football/Soccer specific types
export interface League {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
  round: string
}

export interface Team {
  id: number
  name: string
  logo: string
  country: string
  code?: string
  founded?: number
  national?: boolean
}

export interface Fixture {
  id: number
  referee?: string
  timezone: string
  date: string
  timestamp: number
  status: {
    long: string
    short: string
    elapsed?: number
  }
  venue: {
    id?: number
    name?: string
    city?: string
  }
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
    extratime: {
      home: number | null
      away: number | null
    }
    penalty: {
      home: number | null
      away: number | null
    }
  }
}

// Basketball types
export interface BasketballGame {
  id: number
  date: string
  time: string
  timestamp: number
  timezone: string
  stage: string
  status: {
    long: string
    short: string
    timer?: string
  }
  league: {
    id: number
    name: string
    type: string
    logo: string
  }
  country: {
    id: number
    name: string
    code: string
    flag: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  scores: {
    home: {
      quarter_1?: number
      quarter_2?: number
      quarter_3?: number
      quarter_4?: number
      over_time?: number
      total?: number
    }
    away: {
      quarter_1?: number
      quarter_2?: number
      quarter_3?: number
      quarter_4?: number
      over_time?: number
      total?: number
    }
  }
}

// American Football types
export interface AmericanFootballGame {
  id: number
  date: string
  time: string
  timestamp: number
  timezone: string
  status: {
    long: string
    short: string
    timer?: string
  }
  league: {
    id: number
    name: string
    logo: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  scores: {
    home: {
      quarter_1?: number
      quarter_2?: number
      quarter_3?: number
      quarter_4?: number
      overtime?: number
      total?: number
    }
    away: {
      quarter_1?: number
      quarter_2?: number
      quarter_3?: number
      quarter_4?: number
      overtime?: number
      total?: number
    }
  }
}

// Hockey types
export interface HockeyGame {
  id: number
  date: string
  time: string
  timestamp: number
  timezone: string
  status: {
    long: string
    short: string
    timer?: string
  }
  league: {
    id: number
    name: string
    logo: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  scores: {
    home: {
      period_1?: number
      period_2?: number
      period_3?: number
      overtime?: number
      total?: number
    }
    away: {
      period_1?: number
      period_2?: number
      period_3?: number
      overtime?: number
      total?: number
    }
  }
}

// Baseball types
export interface BaseballGame {
  id: number
  date: string
  time: string
  timestamp: number
  timezone: string
  status: {
    long: string
    short: string
    inning?: number
  }
  league: {
    id: number
    name: string
    logo: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
    }
    away: {
      id: number
      name: string
      logo: string
    }
  }
  scores: {
    home: {
      total?: number
      innings?: number[]
    }
    away: {
      total?: number
      innings?: number[]
    }
  }
}

// Generic API Response types
export interface ApiResponse<T> {
  get: string
  parameters: Record<string, unknown>
  errors: unknown[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: T[]
}

// Unified Game type for all sports
export type Game = Fixture | BasketballGame | AmericanFootballGame | HockeyGame | BaseballGame

// Live scores interface
export interface LiveScore {
  id: number
  sport: string
  league: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: string
  time: string
  date: string
}

// Odds types
export interface Odds {
  id: number
  fixtureId: number
  bookmaker: string
  bet: string
  values: {
    value: string
    odd: string
  }[]
}

// Statistics types
export interface MatchStatistics {
  fixtureId: number
  statistics: {
    team: Team
    statistics: {
      type: string
      value: string | number
    }[]
  }[]
}