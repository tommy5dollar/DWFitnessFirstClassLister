import React, {Component} from 'react'

import {getAllClasses} from './ClassListService'
import {Loader, Table} from "semantic-ui-react"

export default class ListClasses extends Component {
  state = {}

  UNSAFE_componentWillMount = () => {
    getAllClasses()
      .then(allClasses => {
        const sortedClasses = [...allClasses].sort(this.sortClasses)

        this.setState({
          allClasses,
          sortedClasses
        })
      })
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

    // return (
    //   <Fragment>
    //     <Container>
    //       <Header as={`h1`} content={`DW Fitness First class list`} />
    //       {Object.keys(classData).map(date => (
    //         <Segment key={date}>
    //           <Header as={`h2`} content={new Date(parseInt(date, 10)).toDateString()} />
    //           <Item.Group>
    //             {classData[date].map(classItem => (
    //               <Item key={classItem.Id} >
    //                 <Item.Content>
    //                   <Item.Header>{classItem.Name} @ {classItem.FriendlyStartTimeString} - {classItem.FriendlyDurationString} - {classItem.Club.split(`London `).join(``)} - {classItem.Spaces} spaces</Item.Header>
    //                 </Item.Content>
    //               </Item>
    //             ))}
    //           </Item.Group>
    //         </Segment>
    //       ))}
    //     </Container>
    //   </Fragment>
    // )
  }
}