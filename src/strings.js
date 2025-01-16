/*
All strings that need to be translated
*/

// existing languages for frontend strings
export const frontendLanguages = [
  'ar',
  'bg',
  'br',
  'ca',
  'cs',
  'da',
  'de_AT',
  'de',
  'el',
  'en_GB',
  'en',
  'eo',
  'es',
  'fi',
  'fr',
  'ga',
  'he',
  'hr',
  'hu',
  'is',
  'it',
  'ja',
  'ko',
  'lt',
  'lv',
  'mk',
  'nb',
  'nl',
  'nn',
  'pl',
  'pt_BR',
  'pt_PT',
  'ro',
  'ru',
  'sk',
  'sl',
  'sq',
  'sr',
  'sv',
  'ta',
  'tr',
  'uk',
  'vi',
  'zh_CN',
  'zh_HK',
  'zh_TW',
]

// will hold the frontend strings by language code
const frontendStrings = {}

export async function getFrontendStrings(lang) {
  if (!(lang in frontendStrings) && frontendLanguages.includes(lang)) {
    const resp = await fetch(`/lang/${lang}.json`)
    try {
      frontendStrings[lang] = await resp.json()
      // eslint-disable-next-line no-empty
    } catch {}
  }
  return frontendStrings[lang] ?? {}
}

export const grampsStrings = [
  '_Back',
  '_Bookmarks',
  '_Delete',
  '_Generate',
  '_Media Type:',
  '_Names',
  '_Reports',
  '_Save',
  'Abbreviation',
  'Abort changes?',
  'about',
  'About',
  'Above the name',
  'Add a new event',
  'Add a new media object',
  'Add an existing person as a child of the family',
  'Add an existing repository',
  'Add existing child to family',
  'Add',
  'Added',
  'Address Note',
  'Addresses',
  'Adopted people',
  'Adopted',
  'Adult Christening',
  'after',
  'After',
  'Age at death',
  'Age',
  'Agency',
  'Ahnentafel Report',
  'Aide',
  'Album',
  'Also Known As',
  'Alternate Marriage',
  'Ancestor Tree',
  'and',
  'Annulment',
  'Apply',
  'Archive',
  'Association Note',
  'Association',
  'Associations',
  'Attribute Note',
  'Attributes',
  'Audio',
  'Author',
  'Baptism',
  'Bar Mitzvah',
  'Bas Mitzvah',
  'before',
  'Before',
  'between',
  'Birth Date',
  'Birth Date',
  'Birth Name',
  'Birth Place',
  'Birth year',
  'Birth',
  'Birthday and Anniversary Report',
  'Blessing',
  'Bold',
  'Book',
  'Bookstore',
  'Borough',
  'Both',
  'Bottom paper margin',
  'Bride',
  'Building',
  'Burial',
  'Calculated',
  'Calendar',
  'Call name',
  'Call Number',
  'Cancel',
  'Card',
  'Caste',
  'Cause Of Death',
  'Cause',
  'Celebrant',
  'Cemetery',
  'Census',
  'Check and Repair Database',
  'Check and Repair',
  'Check if a separate section is required.',
  'Check Integrity',
  'Child Reference Note',
  'Children',
  'Christening',
  'Church',
  'Citation',
  'Citations having <count> notes',
  'Citations with <count> media',
  'Citations',
  'City',
  'Civil Union',
  'Clear',
  'Clergy',
  'Collection',
  'Color',
  'Complete Individual Report',
  'Complete',
  'Con_fidence',
  'Confidence:',
  'Confidence',
  'Confirmation',
  'Connector',
  'Country',
  'Counts number of ancestors of selected person',
  'County',
  'Create and add a new note',
  'Cremation',
  'CSS filename to use, html format only',
  'Custom',
  'Dashboard',
  'Database overview',
  'Database Summary Report',
  'Date',
  'Death Date',
  'Death Place',
  'Death year',
  'Death',
  'default',
  'Default',
  'Degree',
  'Delete',
  'Deleted',
  'Department',
  'Descendant Report',
  'Descendant Tree',
  'Description',
  'Detailed Ancestral Report',
  'Detailed Descendant Report',
  'Details',
  'Disconnected people',
  'District',
  'Divorce Filing',
  'Divorce',
  'Do not include a title',
  'Do not include any dates or places',
  'Do not include any occupation',
  'Do not include',
  'Do not scale tree',
  'done',
  'Download',
  'E-mail',
  'Edit Citation',
  'Edit Event',
  'Edit Family',
  'Edit Media Object',
  'Edit Note',
  'Edit Person',
  'Edit Place',
  'Edit Repository',
  'Edit Source',
  'Edit',
  'Edited',
  'Education',
  'Elected',
  'Electronic',
  'Emigration',
  'Enclosed By',
  'Encloses',
  'End of Line Report',
  'Engagement',
  'Entire Database',
  'Error',
  'Estimated',
  'Event Note',
  'Event Reference Editor',
  'Event Reference Note',
  'Event Type',
  'Event',
  'Events having <count> notes',
  'Events with <count> media',
  'Events with <count> sources',
  'Events',
  'Families having <count> notes',
  'Families with <count> LDS events',
  'Families with <count> media',
  'Families with <count> sources',
  'Families with incomplete events',
  'Families',
  'Family Descendant Tree',
  'Family Group Report',
  'Family Lines Graph',
  'Family nick name',
  'Family Note',
  'Family Tree',
  'Family',
  'Fan Chart',
  'Farm',
  'Father',
  'Female',
  'Females',
  'Feudal',
  'Fiche',
  'File',
  'Film',
  'Filter',
  'First Communion',
  'Foster',
  'from',
  'FTP',
  'full circle',
  'Full Name',
  'Gallery',
  'Gender',
  'General',
  'Generates documents in OpenDocument Text format (.odt).',
  'Generates documents in plain text format (.txt).',
  'Given name',
  'Given',
  'Godfather',
  'Graduation',
  'Gramps ID',
  'Groom',
  'Hamlet',
  'High',
  'Home Page',
  'Home Person',
  'Hourglass Graph',
  'How to handle living people',
  'Html code',
  'Identification Number',
  'Image',
  'Immigration',
  'Import Family Tree',
  'Import',
  'in',
  'Informant',
  'Inherited',
  'Italic',
  'Item count',
  'Kinship Report',
  'Language',
  'Last changed',
  'Latitude',
  'LDS Note',
  'Left paper margin',
  'Library',
  'Link',
  'List of places to report on',
  'Loading items...',
  'Locality',
  'Location',
  'Longitude',
  'Low',
  'Magazine',
  'Male',
  'Males',
  'Manuscript',
  'Map',
  'Marriage Banns',
  'Marriage Contract',
  'Marriage Date',
  'Marriage License',
  'Marriage Settlement',
  'Marriage',
  'Married Name',
  'Married',
  'Maternal',
  'Matrilineal',
  'Matronymic',
  'Max Ancestor Generations',
  'Max Descendant Generations',
  'Media Note',
  'Media Object',
  'Media Objects',
  'Media Reference Note',
  'Media with <count> sources',
  'Media',
  'Medical Information',
  'Medium',
  'Military Service',
  'Mother',
  'Municipality',
  'Name Note',
  'Name type',
  'Name',
  'National Origin',
  'Naturalization',
  'Neighborhood',
  'New Citation',
  'New Event',
  'New Family',
  'New Media',
  'New Note',
  'New Person',
  'New Place',
  'New Repository',
  'New Source',
  'New Tag',
  'New',
  'Newspaper',
  'Next',
  'Nick name',
  'Nickname',
  'No errors were found: the database has passed internal checks.',
  'No generations of empty boxes for unknown ancestors',
  'No Home Person set.',
  'No items',
  'Nobility Title',
  'None',
  'Normal',
  'Not found',
  'Not Related',
  'Note Link Report',
  'Note type:',
  'Note',
  'Notes',
  'Number of Ancestors Report',
  'Number of Children',
  'Number of citations',
  'Number of events',
  'Number of families',
  'Number of generations:',
  'Number of individuals',
  'Number of Marriages',
  'Number of media',
  'Number of notes',
  'Number of people',
  'Number of places',
  'Number of repositories',
  'Number of sources',
  'Number of tags',
  'Number',
  'Occupation',
  'OK',
  'Options',
  'Ordination',
  'Other',
  'Output file format.',
  'Output file name. MANDATORY',
  'Page',
  'Paper orientation number.',
  'Paper size name.',
  'Parents',
  'Parish',
  'Participants',
  'Partner',
  'Password: ',
  'Paternal',
  'Path',
  'Patrilineal',
  'Patronymic',
  'PDF',
  'People having <count> notes',
  'People marked private',
  'People missing parents',
  'People not marked private',
  'People with <count> addresses',
  'People with <count> associations',
  'People with <count> LDS events',
  'People with <count> media',
  'People with <count> sources',
  'People with a nickname',
  'People with an alternate name',
  'People with children',
  'People with incomplete events',
  'People with incomplete names',
  'people with media',
  'People with multiple marriage records',
  'People with no marriage records',
  'People with unknown gender',
  'People without a known birth date',
  'People without a known death date',
  'People',
  'Person Details',
  'Person Filters',
  'Person Note',
  'Person',
  'Photo',
  'Place Note',
  'Place Report',
  'Place with <count> sources',
  'Place',
  'Places having <count> notes',
  'Places with <count> media',
  'Places',
  'Portrait',
  'Preferences',
  'Prefix',
  'Preview',
  'Previous',
  'Primary',
  'Priority',
  'Private',
  'Probate',
  'Produces a complete report on the selected people',
  'Produces a detailed ancestral report',
  'Produces a detailed descendant report',
  'Produces a family group report showing information on a set of parents and their children.',
  'Produces a graphical ancestral tree',
  'Produces a graphical calendar',
  'Produces a graphical descendant tree around a family',
  'Produces a graphical descendant tree',
  'Produces a list of descendants of the active person',
  'Produces a list of people with a specified tag',
  'Produces a report of birthdays and anniversaries',
  'Produces a textual ancestral report',
  'Produces a textual end of line report',
  'Produces a textual place report',
  'Produces a textual report of kinship for a given person',
  'Produces a timeline chart.',
  'Produces an hourglass graph using Graphviz.',
  'Produces family line graphs using Graphviz.',
  'Produces fan charts',
  'Produces relationship graphs using Graphviz.',
  'Produces statistical bar and pie charts of the people in the database',
  'Property',
  'Provides a summary of the current database',
  'Province',
  'Pseudonym',
  'Publication info',
  'Quality',
  'Range',
  'Record is private',
  'Record is public',
  'Records Report',
  'References',
  'Refresh',
  'Region',
  'Regular',
  'Relationship Graph',
  'Relationship to _Father:',
  'Relationship to _Mother:',
  'Relationship to home person',
  'Relationship to home person',
  'Relationship type:',
  'Relationship',
  'Relationships',
  'Religion',
  'Report',
  'Repositories',
  'Repository Note',
  'Repository Reference Note',
  'Repository',
  'Research',
  'Reset',
  'Residence',
  'Retirement',
  'Right paper margin',
  'Role',
  'Run',
  'Safe',
  'Second date',
  'Select a file',
  'Select a person as the father',
  'Select a person as the mother',
  'Select an existing media object',
  'Select an existing note',
  'Select an existing place',
  'Select an existing source',
  'Select the format to display names',
  'Select...',
  'Select',
  'Selected',
  'self',
  'Set _Home Person',
  'Share an existing event',
  'Show Details',
  'show people by generations',
  'Shows some interesting records about people and families',
  'Shows status of links in notes',
  'Siblings',
  'Size in cm',
  'Social Security Number',
  'Source Note',
  'Source Reference Note',
  'Source text',
  'Source: Author',
  'Source: Title',
  'Source',
  'Sources having <count> notes',
  'Sources with <count> media',
  'Sources with <count> Repository references',
  'Sources',
  'Span',
  'Sponsored',
  'Spouses',
  'Start',
  'State',
  'Statistics Charts',
  'Statistics',
  'Status',
  'Stepchild',
  'Stop',
  'Street',
  'Style name.',
  'Suffix',
  'Sunday',
  'Surname origin type:',
  'Surname',
  'Surnames',
  'System Information',
  'Tag Report',
  'Tag',
  'Tags',
  'Taken',
  'Text',
  'The centre person for the report',
  'The format and language for dates, with examples',
  'The number of characters per line',
  'The number of generations to include in the report',
  'The translation to be used for the report.',
  'This field is mandatory',
  'Time',
  'Timeline Chart',
  'Timeline',
  'Title',
  'To Do',
  'to',
  'Tombstone',
  'Top Left',
  'Top paper margin',
  'Total size of media objects',
  'Town',
  'Transcript',
  'Type',
  'Underline',
  'Undo',
  'Unknown ',
  'Unknown',
  'Unmarried',
  'Updating checksums on media',
  'upright',
  'Use Compression',
  'Use Fathers Display format',
  'Username: ',
  'Value',
  'Version',
  'Very High',
  'Very Low',
  'Video',
  'Village',
  'Web Home',
  'Web Search',
  'Web site',
  'Whether a line break should follow the name.',
  'Whether to include Gramps IDs',
  'Whether to include private data',
  'Whether to restrict data on recently-dead people',
  'Whether to start a new page after each generation.',
  'white',
  'Wife',
  'Will',
  'Witness',
  'Zoom',
  "Don't use call name",
  "Father's Age",
  "Mother's Age",
  "Wives use husband's surname (from first family listed)",
]
