type Record = {
  weeks: number[]
  weekday: number
  start: number
  end: number
}

enum Decision {
  Both = '全天不打卡班次（全天有课）',
  Morning = '下半天班次（上半天有课）',
  Afternoon = '上半天班次（下半天有课）',
  None = '全天班次（全天无课）',
  NotApplicable = '休',
}

export function transform(
  date_range: [Date, Date],
  schedule: string,
  first_date: Date,
): string {
  const records = schedule.split('\n').filter((row) => row != '').filter(
    (row) => row != '上课周次	上课星期	开始节次	结束节次',
  ).map(parse_row)

  const decisions: Decision[] = []
  for (
    // Copy the date is necessary
    let d = new Date(date_range[0]);
    d <= date_range[1];
    d.setDate(d.getDate() + 1)
  ) {
    decisions.push(decide(d, records, first_date))
  }

  console.log(decisions)

  return decisions.join('\t')
}

function decide(date: Date, records: Record[], first_date: Date): Decision {
  if (date.getDay() === 0 || date.getDay() === 6) {
    return Decision.NotApplicable
  } else {
    const oneDay = 24 * 60 * 60 * 1000
    const daysSinceFirstDate = Math.floor(
      (date.getTime() - first_date.getTime()) / oneDay,
    )
    const currentWeek = Math.floor(daysSinceFirstDate / 7) + 1

    const todayRecords = records.filter((record) =>
      record.weeks.includes(currentWeek) && record.weekday === date.getDay() - 1
    )

    const hasMorningClass = todayRecords.some((record) => record.start <= 5)
    const hasAfternoonClass = todayRecords.some((record) =>
      record.start <= 10 && record.end >= 6
    )

    if (hasMorningClass && hasAfternoonClass) {
      return Decision.Both
    } else if (hasMorningClass) {
      return Decision.Morning
    } else if (hasAfternoonClass) {
      return Decision.Afternoon
    } else {
      return Decision.None
    }
  }
}

function parse_row(row: string): Record {
  const [weeks, weekday, start, end] = row.split('\t')
  return {
    weeks: parse_weeks(weeks),
    weekday: '一二三四五六日'.indexOf(weekday.replace('星期', '')),
    start: parseInt(start.replace('第', '').replace('节', '')),
    end: parseInt(end.replace('第', '').replace('节', '')),
  }
}

function parse_weeks(weeks: string): number[] {
  if (weeks.includes('-')) {
    const [start, end] = weeks.replace('周', '').split('-').map(Number)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  } else {
    return [parseInt(weeks.replace('周', ''))]
  }
}
