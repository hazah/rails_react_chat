json.(channel, :id, :name)
json.users do
  json.array! channel.users, partial: "users/user", as: :user
end
if action_name == "show"
  json.array! channel.messages, partial: "messages/message", as: :message
end