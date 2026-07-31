/**
 * Google Sheets data composable
 * Fetches live CSV data from the public IEACET Google Sheet.
 *
 * Sheet ID: 1mjq5S0y4sgA4VOceAjCSja9Rl8UEizJyJ2o50Xws0r0
 * Sheets:
 *  gid=0            → syllabus   (Scheme, Semester, File Name, Link)
 *  gid=1015609538   → pyqs       (Scheme, Semester, Subject, Link)
 *  gid=1791922244   → notes      (Scheme, Semester, Subject, Link)
 *  gid=742821559    → placements (Company, Count)
 *  gid=1104392461   → scholarships (Title, Description, Link)
 */

import { ref, onMounted } from 'vue'

const SHEET_ID = '1mjq5S0y4sgA4VOceAjCSja9Rl8UEizJyJ2o50Xws0r0'

function csvUrl(gid: string) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`
}

/** Minimal RFC-4180 CSV parser – handles quoted fields with commas & newlines */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else {
        field += ch
      }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { row.push(field); field = '' }
      else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
        if (ch === '\r') i++
        row.push(field); field = ''
        if (row.some(c => c !== '')) rows.push(row)
        row = []
      } else {
        field += ch
      }
    }
  }
  if (field || row.length) { row.push(field); if (row.some(c => c !== '')) rows.push(row) }
  return rows
}

/** Turn parsed rows (skipping header) into objects keyed by header names */
function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return []
  const [header, ...data] = rows
  return data.map(row => {
    const obj: Record<string, string> = {}
    header.forEach((key, i) => { obj[key.trim()] = (row[i] ?? '').trim() })
    return obj
  })
}

async function fetchSheet(gid: string) {
  const res = await fetch(csvUrl(gid))
  if (!res.ok) throw new Error(`Failed to load sheet gid=${gid}`)
  const text = await res.text()
  return rowsToObjects(parseCsv(text))
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SyllabusFile { name: string; link: string }
export interface SyllabusSemester { id: number; title: string; files: SyllabusFile[] }
export interface SyllabusScheme { year: string; semesters: SyllabusSemester[] }

export interface PyqSubject { name: string; link: string }
export interface PyqSemester { semester: string; subjects: PyqSubject[] }
export interface PyqScheme { scheme: string; semesters: PyqSemester[] }

export interface NotesSubject { name: string; link: string }
export interface NotesSemester { semester: string; subjects: NotesSubject[] }
export interface NotesScheme { scheme: string; semesters: NotesSemester[] }

export interface Placement { company: string; count: number }
export interface Scholarship { title: string; desc: string; link: string }

// ─── Syllabus ─────────────────────────────────────────────────────────────────

export function useSyllabus() {
  const schemes = ref<SyllabusScheme[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const rows = await fetchSheet('0')
      // Build: { '2024': { 'Semester 1': [{ name, link }] } }
      const map: Record<string, Record<string, SyllabusFile[]>> = {}
      for (const r of rows) {
        const scheme = r['Scheme'] || r['scheme']
        const semester = r['Semester'] || r['semester']
        const name = r['File Name'] || r['file name'] || r['FileName']
        const link = r['Link'] || r['link']
        if (!scheme || !semester) continue
        if (!map[scheme]) map[scheme] = {}
        if (!map[scheme][semester]) map[scheme][semester] = []
        map[scheme][semester].push({ name: name ?? '', link: link ?? '' })
      }
      const result: SyllabusScheme[] = []
      for (const [year, semMap] of Object.entries(map)) {
        let id = 1
        const semesters: SyllabusSemester[] = Object.entries(semMap).map(([title, files]) => ({
          id: id++,
          title,
          files
        }))
        result.push({ year, semesters })
      }
      schemes.value = result
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return { schemes, loading, error }
}

// ─── PYQs ────────────────────────────────────────────────────────────────────

export function usePyqs() {
  const pyq = ref<PyqScheme[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const rows = await fetchSheet('1015609538')
      const map: Record<string, Record<string, PyqSubject[]>> = {}
      for (const r of rows) {
        const scheme = r['Scheme'] || r['scheme']
        const semester = r['Semester'] || r['semester']
        const subject = r['Subject'] || r['subject']
        const link = r['Link'] || r['link']
        if (!scheme || !semester || !subject) continue
        if (!map[scheme]) map[scheme] = {}
        if (!map[scheme][semester]) map[scheme][semester] = []
        map[scheme][semester].push({ name: subject, link: link ?? '' })
      }
      const result: PyqScheme[] = []
      for (const [scheme, semMap] of Object.entries(map)) {
        const semesters: PyqSemester[] = Object.entries(semMap).map(([semester, subjects]) => ({
          semester: semester.replace('Semester ', 'S'),
          subjects
        }))
        result.push({ scheme, semesters })
      }
      pyq.value = result
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return { pyq, loading, error }
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export function useNotes() {
  const notes = ref<NotesScheme[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const rows = await fetchSheet('1791922244')
      const map: Record<string, Record<string, NotesSubject[]>> = {}
      for (const r of rows) {
        const scheme = r['Scheme'] || r['scheme']
        const semester = r['Semester'] || r['semester']
        const subject = r['Subject'] || r['subject']
        const link = r['Link'] || r['link']
        if (!scheme || !semester || !subject) continue
        if (!map[scheme]) map[scheme] = {}
        if (!map[scheme][semester]) map[scheme][semester] = []
        map[scheme][semester].push({ name: subject, link: link ?? '' })
      }
      const result: NotesScheme[] = []
      for (const [scheme, semMap] of Object.entries(map)) {
        const semesters: NotesSemester[] = Object.entries(semMap).map(([semester, subjects]) => ({
          semester: semester.replace('Semester ', 'S'),
          subjects
        }))
        result.push({ scheme, semesters })
      }
      notes.value = result
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return { notes, loading, error }
}

// ─── Placements ──────────────────────────────────────────────────────────────

export function usePlacements() {
  const placements = ref<Placement[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const rows = await fetchSheet('742821559')
      placements.value = rows
        .filter(r => r['Company'] || r['company'])
        .map(r => ({
          company: r['Company'] || r['company'] || '',
          count: parseInt(r['Count'] || r['count'] || '0', 10)
        }))
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return { placements, loading, error }
}

// ─── Scholarships ─────────────────────────────────────────────────────────────

export function useScholarships() {
  const scholarships = ref<Scholarship[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const rows = await fetchSheet('1104392461')
      scholarships.value = rows
        .filter(r => r['Title'] || r['title'])
        .map(r => ({
          title: r['Title'] || r['title'] || '',
          desc: r['Description'] || r['description'] || '',
          link: r['Link'] || r['link'] || ''
        }))
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return { scholarships, loading, error }
}
