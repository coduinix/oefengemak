import type { ExerciseType, ValidationIssue } from '@/domain/core'

interface TypeStrings {
  readonly name: string
  readonly title: string
  readonly blurb: string
}

export const typeStrings: Readonly<Record<ExerciseType, TypeStrings>> = {
  splitsen: {
    name: 'Splitsen',
    title: 'Splits sommen',
    blurb: 'Oefen het splitsen door meerdere splits-opgaven te combineren',
  },
  plus: {
    name: 'Plus',
    title: 'Plus sommen',
    blurb: 'Oefen plus sommen door meerdere plus-opgaven te combineren',
  },
  min: {
    name: 'Min',
    title: 'Min sommen',
    blurb: 'Oefen min sommen door meerdere min-opgaven te combineren',
  },
  tafels: {
    name: 'Tafels',
    title: 'Tafel sommen',
    blurb: 'Oefen de tafels door een of meerdere tafel-opgaven te combineren',
  },
  delen: {
    name: 'Delen',
    title: 'Deelsommen',
    blurb: 'Oefen het delen t/m 100',
  },
  breuken: {
    name: 'Breuken',
    title: 'Breuken',
    blurb: 'Oefen breuken t/m 100',
  },
}

export const nl = {
  actions: {
    generate: 'Maak oefenblad',
    regenerate: 'Nieuwe sommen',
    print: 'Print',
    copyLink: 'Kopieer link',
  },
  form: {
    options: 'Opties',
    title: 'Titel oefenblad',
    titlePlaceholder: 'Bijvoorbeeld: Plus sommen t/m 20',
    perBlock: 'Sommen per blok',
    count: 'Aantal sommen',
    range: 'Bereik',
    numbers: 'Getallen',
    tables: 'Tafels',
    divisors: 'Delers',
    denominator: 'Noemer',
  },
  sheet: {
    name: 'Naam:',
    nameRule: '______________',
    answers: 'Antwoordenvel',
    untitled: 'Oefenblad',
  },
  blockCounts: {
    plus: {
      result: 'Aantal 6+5=...',
      lhs: 'Aantal ...+5=30',
      rhs: 'Aantal 6+...=30',
    },
    min: {
      result: 'Aantal 6-5=...',
      lhs: 'Aantal ...-5=30',
      rhs: 'Aantal 35-...=30',
    },
    tafels: {
      result: 'Aantal 6x5=...',
      lhs: 'Aantal ...x5=30',
      rhs: 'Aantal 6x...=30',
    },
    delen: {
      result: 'Aantal 30:5=...',
      lhs: 'Aantal ...:5=6',
      rhs: 'Aantal 30:...=6',
    },
    breuken: {
      add: 'Aantal optellen',
      sub: 'Aantal aftrekken',
      mul: 'Aantal vermenigvuldigen',
      div: 'Aantal delen',
    },
  },
  plusRanges: {
    '10': 't/m 10',
    '20-none': 't/m 20 zonder tientaloverschrijding',
    '20': 't/m 20 met tientaloverschrijding',
    '50': 't/m 50',
    '100': 't/m 100',
    '1000': 't/m 1000',
  },
  minRanges: {
    '10': 't/m 10',
    '20': 't/m 20',
    '50': 't/m 50',
    '100': 't/m 100',
    '1000': 't/m 1000',
  },
  breukenDenominators: {
    '10': 'Breuken t/m 10',
    '50': 'Breuken t/m 50',
    '100': 'Breuken t/m 100',
  },
  tafelLabel: (table: number) => `Tafel ${table}`,
  toast: {
    repaired: 'Sommige instellingen in de link waren ongeldig. Standaardwaarden zijn gebruikt.',
    linkCopied: 'Link gekopieerd naar het klembord.',
    linkFailed: 'Kopiëren lukt niet in deze browser. Kopieer de link uit de adresbalk.',
  },
  preview: {
    emptyTitle: 'Nog geen oefenblad',
    emptyBody: 'Stel links de opties in en klik op "Maak oefenblad".',
  },
  home: {
    heroTitle: 'Gratis oefenbladen voor het basisonderwijs',
    heroBody: 'Snel samenstellen, downloaden en printen. Voor leerkrachten én ouders.',
    features: ['100% gratis te gebruiken', 'Geen account nodig', 'Direct printen'],
    exampleTitle: 'Voorbeeld',
    postit: 'Nieuw: nu ook breuken oefenbladen!',
    chooseTitle: 'Kies een oefenblad',
    chooseBody: 'Voor welk onderwerp wil je een oefenblad maken?',
    howTitle: 'Zo werkt het',
    steps: [
      {
        title: 'Kies een oefenblad',
        body: 'Selecteer het onderwerp waarvoor je wilt oefenen.',
      },
      {
        title: 'Stel samen',
        body: 'Kies de opgaven die je wilt gebruiken en pas aan waar nodig.',
      },
      {
        title: 'Print',
        body: 'Print het blad direct of bewaar het als PDF.',
      },
    ],
    supportTitle: 'Steun Oefengemak',
    supportBody:
      'Vind je deze site waardevol? Overweeg om ons te steunen met een kleine bijdrage. Dankjewel!',
    supportAction: 'Steun Oefengemak',
  },
  about: {
    title: 'Over Oefengemak',
    goalTitle: 'Doel',
    goal: "Oefengemak.nl is samen met diverse leerkrachten uit het primair onderwijs ontwikkeld om op een eenvoudige en toch flexibele manier oefenbladen te kunnen maken. De oefenbladen worden gevuld met 'willekeurige' opgaves die aan de in te stellen moeilijkheidsgraad voldoen. Daarnaast is ook het aantal te genereren opgaven eenvoudig in te stellen. Op veler verzoek wordt er naast de opgaves ook een antwoordvel gegenereerd om het nakijken door de leerkracht te versnellen.",
    faqTitle: 'Veelgestelde vragen',
    faq: [
      {
        question: 'Hoe print ik een oefenblad?',
        answer:
          'Klik op de knop Print, of gebruik de printfunctie van je browser (Ctrl-P, of Cmd-P op een Mac). Het oefenblad en het antwoordenvel worden op aparte pagina’s afgedrukt.',
      },
      {
        question: 'Ik heb een idee of een suggestie, waar kan ik die kwijt?',
        answer: 'Stuur een mailtje naar info@oefengemak.nl. We horen graag wat er beter kan.',
      },
    ],
  },
  doneren: {
    title: 'Steun Oefengemak',
    body: 'Oefengemak is gratis en blijft gratis. De site wordt in vrije tijd gemaakt en onderhouden; de hosting betalen we zelf.',
    comingSoon:
      'Een doneeroptie is in de maak. Zodra we een betaalmethode hebben die iDEAL ondersteunt, verschijnt hier een knop.',
    contact: 'Wil je nu al iets bijdragen of meedenken? Mail ons gerust.',
    email: 'info@oefengemak.nl',
  },
  notFound: {
    title: 'Pagina niet gevonden',
    body: 'Deze pagina bestaat niet (meer). Ga terug naar de startpagina.',
    action: 'Naar de startpagina',
  },
} as const

export function issueMessage(issue: ValidationIssue, type: ExerciseType): string {
  switch (issue.code) {
    case 'EMPTY_SELECTION':
      return type === 'tafels' ? 'Kies minstens één tafel.' : 'Kies minstens één getal.'
    case 'NO_EXERCISES':
      return 'Stel minstens één blok in.'
    case 'TOO_MANY_EXERCISES':
      return 'Dit oefenblad is te groot. Kies minder blokken.'
    case 'INVALID_FIELD':
      return 'Deze waarde kan niet worden gebruikt.'
  }
}
