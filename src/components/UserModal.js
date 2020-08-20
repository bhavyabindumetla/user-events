import React from 'react'
import { DialogTitle, Typography, IconButton, DialogContent, Grid, Card, Box, makeStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#0b0b0d",
  },
  card: {
    margin: "2px",
    padding: "1.4rem",
    background:"#d3d5fd"
  },
  inputRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.2rem 1rem',
  }
}));

// styles for date picker
const inputStyles = makeStyles((theme) => ({
  input: {
    color: "white",
    background: "#474a56 !important",
    padding: '10px',
    border: '0px',
    borderRadius: '5px',
  }
}))

// custom date picker input
const CustomInput = ({ value, onClick }) => {
  const classes = inputStyles()
  return <button className={classes.input} onClick={onClick}>
    {value}
  </button>

}

function UserModal(props) {
  const { user, onClose } = props
  const classes = useStyles()
  const [startDate, setStartDate] = React.useState(new Date());
  const [events, setEvents] = React.useState([])

  React.useEffect(() => {
    // fetching user today events
    getEvents(user?.activity_periods, new Date())
  }, [])

  // returning user all event dates for calender active dates
  const highlightDates = (dates) => {
    if (!dates.length) return
    else {
      let datesArray = []
      dates.map((date) => {
        datesArray.push(new Date(formatDate(date?.start_time)))
      })
      console.log('dates', dates, datesArray, user)
      return datesArray
    }
  }

  // formatting date (removing extra spaces and adding space between time and meridiem)
  const formatDate = (date) => {
    date = date.replace('  ', ' ')
    if (date.includes("PM"))
      date = date.replace(/PM/, " PM")
    if (date.includes("AM"))
      date = date.replace(/AM/, " AM")

    const formattedDate = new Date(date).toLocaleString("en-US", { timeZone: user.tz});
    console.log('date',date, formattedDate)
    return formattedDate
  }

  // getting user events on particular date
  const getEvents = (userEvents, date) => {
    let events = userEvents.filter((event) => {
      let eventDate = new Date(formatDate(event.start_time))
      let todayDate = new Date(date)
      if (todayDate.getDate() === eventDate.getDate() && todayDate.getMonth() === eventDate.getMonth() && todayDate.getFullYear() === eventDate.getFullYear()) {
        return event
      }
    })
    setEvents(events)
  }

  return (
    <div className='dialog-root'>

      {/* Heading */}
      <DialogTitle disableTypography className={classes.title}>
        <Typography className='heading' variant="h6">{`Hello ${user?.real_name}!`}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>

      <DialogContent style={{ height: "450px" }}>
        <Grid container>
          
          {/* user details */}
          <Grid sm={12} md={6}>
            <Card className={classes.card}>
              <Box>
                ID: {` ${user.id}`}
              </Box>
              <Box>
                Timezone: {` ${user.tz}`}
              </Box>
            </Card>
          </Grid>

          <Grid sm={12} md={6}>
            {/* date picker` */}
            <div className={classes.inputRoot}>
              <DatePicker
                selected={startDate}
                onChange={date => {
                  setStartDate(date)
                  getEvents(user?.activity_periods, date)
                }}
                highlightDates={[...highlightDates(user?.activity_periods)]}
                placeholderText="Click change date"
                customInput={<CustomInput />}
              />
            <Typography>{`Click to change date`}</Typography>
            </div>
          </Grid>
          
        </Grid>

        {/* events */}
        <Typography className='heading'>Events</Typography>
        <Grid container>
          {
            events?.length ? events.map((event, index) => (
              <Card className={classes.card}>
                <Grid sm={12} md={12} direction="row">
                  <Typography className='heading'> Event {index + 1}</Typography>
                  <Box> Start Time:{` ${event.start_time}`}</Box>
                  <Box>End Time: {` ${event.end_time}`}
                  </Box>
                </Grid>
              </Card>

            )) : " No events"
          }
        </Grid>
      </DialogContent>
    </div>
  )
}

export default UserModal