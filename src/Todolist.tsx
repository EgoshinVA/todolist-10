import {FilterValuesType, TaskType} from "./app/App";
import {ChangeEvent} from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from "@mui/material/Box";
import {filterButtonsContainerSx, getListItemSx} from "./Todolist.styles";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./model/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./app/store";


type PropsType = {
	title: string
	todolistId: string
	changeFilter: (filter: FilterValuesType, todolistId: string) => void
	filter: FilterValuesType
	removeTodolist: (todolistId: string) => void
	updateTodolist: (todolistId: string, title: string) => void
}

export const Todolist = (props: PropsType) => {
	const {
		title,
		filter,
		changeFilter,
		todolistId,
		removeTodolist,
		updateTodolist
	} = props

	const tasks = useSelector<RootState, TaskType[]>(state => state.tasks[todolistId])
	const dispatch = useDispatch()

	let tasksForTodolist = tasks

	if (filter === 'active') {
		tasksForTodolist = tasksForTodolist.filter(task => !task.isDone)
	}

	if (filter === 'completed') {
		tasksForTodolist = tasksForTodolist.filter(task => task.isDone)
	}

	const changeFilterTasksHandler = (filter: FilterValuesType) => {
		changeFilter(filter, props.todolistId)
	}

	const removeTodolistHandler = () => {
		removeTodolist(todolistId)
	}

	const addTaskCallback = (title: string) => {
		addTask(title, props.todolistId)
	}

	const updateTodolistHandler = (title: string) => {
		updateTodolist(props.todolistId, title)
	}

	const removeTask = (taskId: string, todolistId: string) => {
		dispatch(removeTaskAC({taskId, todolistId}))
	}

	const addTask = (title: string, todolistId: string) => {
		dispatch(addTaskAC({todolistId, title}))
	}

	const changeTaskStatus = (taskId: string, taskStatus: boolean, todolistId: string) => {
		dispatch(changeTaskStatusAC({todolistId, taskId, isDone: taskStatus}))
	}
	const updateTask = (todolistId: string, taskId: string, title: string) => {
		dispatch(changeTaskTitleAC({taskId, todolistId, title}))
	}

	return (
		<div>
			<div className={"todolist-title-container"}>
				<h3><EditableSpan value={title} onChange={updateTodolistHandler}/></h3>
				<IconButton onClick={removeTodolistHandler}>
					<DeleteIcon/>
				</IconButton>
			</div>
			<AddItemForm addItem={addTaskCallback}/>
			{
				tasks.length === 0
					? <p>Тасок нет</p>
					: <List>
						{tasksForTodolist.map((task) => {

							const removeTaskHandler = () => {
								removeTask(task.id, todolistId)
							}

							const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
								const newStatusValue = e.currentTarget.checked
								changeTaskStatus(task.id, newStatusValue, todolistId)
							}

							const changeTaskTitleHandler = (title: string) => {
								updateTask(todolistId, task.id, title)
							}
							return <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
								<div>
									<Checkbox checked={task.isDone} onChange={changeTaskStatusHandler}/>
									<EditableSpan value={task.title} onChange={changeTaskTitleHandler}/>
								</div>
								<IconButton onClick={removeTaskHandler}>
									<DeleteIcon/>
								</IconButton>
							</ListItem>
						})}
					</List>
			}
			<Box sx={filterButtonsContainerSx}>
				<Button
					variant={filter === 'all' ? 'outlined' : 'text'}
					color={'inherit'}
					onClick={() => changeFilterTasksHandler('all')}>
					All
				</Button>
				<Button
					variant={filter === 'active' ? 'outlined' : 'text'}
					color={'primary'}
					onClick={() => changeFilterTasksHandler('active')}>
					Active
				</Button>
				<Button
					variant={filter === 'completed' ? 'outlined' : 'text'}
					color={'secondary'}
					onClick={() => changeFilterTasksHandler('completed')}>
					Completed
				</Button>
			</Box>
		</div>
	)
}
