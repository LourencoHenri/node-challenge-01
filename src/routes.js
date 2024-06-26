import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const tasks = database.select("tasks", null);

			return res.writeHead(201).end(JSON.stringify(tasks));
		},
	},
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { title, description } = req.body;

			const task = {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: new Date(),
				updated_at: new Date(),
			};

			database.insert("tasks", task);

			return res.writeHead(201).end(JSON.stringify(task));
		},
	},
	{
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const { title, description, completed_at } = req.body;

			database.update("tasks", id, {
				title,
				description,
				completed_at,
				updated_at: new Date(),
			});

			return res.writeHead(204).end();
		},
	},
	{
		method: "PATCH",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const { completed_at } = req.body;

			const taskStatus = completed_at ? new Date() : null;

			database.done("tasks", id, {
				completed_at: taskStatus,
				updated_at: new Date(),
			});

			return res.writeHead(204).end();
		},
	},
	{
		method: "DELETE",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;

			database.delete("tasks", id);

			return res.end();
		},
	},
];
