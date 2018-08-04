import React, {Component} from 'react'

import {getAllClasses} from './ClassListService'
import {Icon, Loader, Table} from "semantic-ui-react"

const memberId = `523020113`

const clubsToSearch = [
  `FENCH`,
  `THOM`,
  `SPIT`,
  `DEVON`
]

const daysToAvoid = [
  `Sat`,
  `Sun`
]

// const classesToAvoid = [
//   `AGT Power`,
//   `AGT Speed`,
//   `Aqua`,
//   `BEAT Pro Athlete 80% HR`,
//   `BEAT Hiit Pro 90% HR`,
//   `BODYBALANCE`,
//   `BODYCOMBAT`,
//   `Bootcamp`,
//   `Boxing`,
//   `Core`,
//   `FGT Glute Gains`,
//   `Grit Cardio`,
//   `Grit Plyo`,
//   `Legs Bums & Tums`,
//   `Pilates`,
//   `Pro Cycling`,
//   `RPM`,
//   `SPARR`,
//   `Spin`,
//   `Step`,
//   `Stretch`,
//   `Swiss Ball`,
//   `Vinyasa Yoga`,
//   `Yoga`,
//   `ZUMBA`
// ]

const classesToAvoid = []

const earliestStartHours = 7
const latestStartHours = 18

export default class ListClasses extends Component {
  state = {}

  UNSAFE_componentWillMount = () => {
    getAllClasses(clubsToSearch, memberId)
      .then(allClasses => {
        const classNames = allClasses.reduce((agg, classItem) => {
          if (!agg.includes(classItem.Name)) agg.push(classItem.Name)
          return agg
        }, [])

        console.log(classNames.sort())

        const sortedClasses = [...allClasses]
          .filter(classItem => !daysToAvoid.includes(classItem.FriendlyStartDateString.split(` `)[0]))
          .filter(this.timeFilter)
          .filter(classItem => !classesToAvoid.includes(classItem.Name))
          .sort(this.sortClasses)

        this.setState({
          allClasses,
          sortedClasses,
          classNames
        })
      })
  }

  timeFilter = classItem => {
    const timeParts = classItem.FriendlyStartTimeString.split(`:`)
    const timeInMins = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10)

    return timeInMins >= earliestStartHours * 60 && timeInMins <= latestStartHours * 60
  }

  sortClasses = (a, b) => {
    const aStart = this.convertToTicks(a.Start)
    const bStart = this.convertToTicks(b.Start)

    return aStart > bStart
      ? 1
      : aStart < bStart
        ? -1
        : 0
  }

  convertToTicks = dateString => parseInt(dateString.split(`/Date(`).join(``).split(`)/`).join(``), 10)

  render = () => {
    const { sortedClasses } = this.state

    if (!sortedClasses) return (
      <Loader
        active
        content={`Loading class data...`}
        size={`massive`}
      />
    )

    console.log(sortedClasses)

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Class</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Club</Table.HeaderCell>
            <Table.HeaderCell>Spaces</Table.HeaderCell>
            <Table.HeaderCell>Instructor</Table.HeaderCell>
            <Table.HeaderCell>Room</Table.HeaderCell>
            <Table.HeaderCell>Booked</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedClasses.map(classItem => (
            <Table.Row key={classItem.Id}>
              <Table.Cell>{classItem.FriendlyStartDateString}</Table.Cell>
              <Table.Cell>{classItem.FriendlyStartTimeString}</Table.Cell>
              <Table.Cell>{classItem.Name}</Table.Cell>
              <Table.Cell>{classItem.FriendlyDurationString}</Table.Cell>
              <Table.Cell>{classItem.Club.split(`London `).join(``)}</Table.Cell>
              <Table.Cell>{classItem.Spaces}</Table.Cell>
              <Table.Cell>{classItem.Instructor}</Table.Cell>
              <Table.Cell>{classItem.Room} {classItem.RoomNumber || ``}</Table.Cell>
              <Table.Cell>
                <Icon
                  name={classItem.Booked ? `check` : `close`}
                  color={classItem.Booked ? `green` : `red`}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}