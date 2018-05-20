import React, {Component} from 'react'

import {getAllClasses} from './ClassListService'
import {Loader, Table} from "semantic-ui-react"

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

const classesToAvoid = [
  `RPM`,
  `Spin`,
  `BODYCOMBAT`,
  `Pilates`,
  `SPARR`,
  `ZUMBA`,
  `Yoga`,
  `Boxing`,
  `Legs Bums & Tums`,
  `Aqua`,
  `Vinyasa Yoga`,
  `Pro Cycling`
]

const earliestStartHours = 8
const latestStartHours = 18

export default class ListClasses extends Component {
  state = {}

  UNSAFE_componentWillMount = () => {
    getAllClasses(clubsToSearch)
      .then(allClasses => {
        const classNames = allClasses.reduce((agg, classItem) => {
          if (!agg.includes(classItem.Name)) agg.push(classItem.Name)
          return agg
        }, [])

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
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}