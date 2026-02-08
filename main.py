def main():
    todo_list = []
    print("--- GIAIC Hackathon Phase 1: Todo App ---")
    
    while True:
        print("\n1. Add Task  2. Show Tasks  3. Delete Task  4. Exit")
        choice = input("Select an option: ")

        if choice == "1":
            task = input("Enter the task: ")
            todo_list.append(task)
            print("Task added!")
        elif choice == "2":
            print("\nYour Tasks:")
            for i, task in enumerate(todo_list, 1):
                print(f"{i}. {task}")
        elif choice == "3":
            try:
                idx = int(input("Enter task number to delete: ")) - 1
                if 0 <= idx < len(todo_list):
                    todo_list.pop(idx)
                    print("Deleted!")
                else:
                    print("Invalid number.")
            except ValueError:
                print("Please enter a valid number.")
        elif choice == "4":
            print("Goodbye!")
            break

if __name__ == "__main__":
    main() 
