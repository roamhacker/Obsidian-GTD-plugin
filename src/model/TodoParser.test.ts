import { TodoItemStatus } from './TodoItem';
import { TodoParser } from './TodoParser';
import { TodoItemIndexProps } from '../model/TodoIndex';

const props = {
  personRegexp: new RegExp('\\[{2}(People\\/*.)\\]{2}'),
  projectRegexp: new RegExp('\\[{2}(Projects\\/*.)\\]{2}'),
  locationRegexp: new RegExp('\\[{2}(Locations\\/*.)\\]{2}'),
  miscRegexp: new RegExp('(.*)'),
  dateRegexp: new RegExp('#(\\d{4}\\/\\d{2}\\/\\d{2})'),
  actionTagOneRegexp: new RegExp('#(discussWith)'),
  actionTagTwoRegexp: new RegExp('#(waitingFor)'),
  actionTagThreeRegexp: new RegExp('#(promisedTo)'),
  somedayMaybeRegexp: new RegExp('#(someday)'),
  excludePath: '',
  excludeFilenameFragment: '',
  excludeTagRegexp: new RegExp(''),
};
const todoParser = new TodoParser(props);

test('parsing an outstanding todo', async () => {
  const contents = `- [ ] This is something that needs doing`;
  const todos = await todoParser.parseTasks('/', contents);
  const todo = todos[0];
  expect(todo.startIndex).toEqual(2);
  expect(todo.length).toEqual(38);
  expect(todo.sourceFilePath).toEqual('/');
  expect(todo.status).toEqual(TodoItemStatus.Todo);
  expect(todo.description).toEqual('This is something that needs doing');
  expect(todo.actionDate).toBeUndefined();
  expect(todo.isSomedayMaybeNote).toEqual(false);
});

test('parsing a completed todo', async () => {
  const contents = `- [x] This is something that has been completed`;
  const todos = await todoParser.parseTasks('/', contents);
  const todo = todos[0];
  expect(todo.startIndex).toEqual(2);
  expect(todo.length).toEqual(45);
  expect(todo.sourceFilePath).toEqual('/');
  expect(todo.status).toEqual(TodoItemStatus.Done);
  expect(todo.description).toEqual('This is something that has been completed');
  expect(todo.actionDate).toBeUndefined();
  expect(todo.isSomedayMaybeNote).toEqual(false);
});

test('parsing an outstanding todo with a specific action date', async () => {
  const contents = `- [ ] This is something that needs doing #2021/02/16`;
  const todos = await todoParser.parseTasks('/', contents);
  const todo = todos[0];
  expect(todo.startIndex).toEqual(2);
  expect(todo.length).toEqual(50);
  expect(todo.sourceFilePath).toEqual('/');
  expect(todo.status).toEqual(TodoItemStatus.Todo);
  expect(todo.description).toEqual('This is something that needs doing #2021/02/16');
  expect(todo.actionDate).toEqual(new Date('2021-02-16'));
  expect(todo.isSomedayMaybeNote).toEqual(false);
});

test('parsing an outstanding someday/maybe todo', async () => {
  const contents = `- [ ] This is something that needs doing #someday`;
  const todos = await todoParser.parseTasks('/', contents);
  const todo = todos[0];
  expect(todo.startIndex).toEqual(2);
  expect(todo.length).toEqual(47);
  expect(todo.sourceFilePath).toEqual('/');
  expect(todo.status).toEqual(TodoItemStatus.Todo);
  expect(todo.description).toEqual('This is something that needs doing #someday');
  expect(todo.actionDate).toBeUndefined();
  expect(todo.isSomedayMaybeNote).toEqual(true);
});
