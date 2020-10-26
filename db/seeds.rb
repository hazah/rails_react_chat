# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

users = User.create [
  { email: "one@example.com", password: "password" },
  { email: "two@example.com", password: "password" },
  { email: Faker::Internet.email, password: Faker::Internet.password },
  { email: Faker::Internet.email, password: Faker::Internet.password },
]

channels = Channel.create [
  { name: 'Channel One' },
  { name: 'Channel Two' },
  { name: 'Channel Three' },
  { name: 'Channel Four' },
  { name: 'Channel Five' },
]

[2, 3].each do |user|
  [0..4].each do |channel|
    users[user].channels << channels[channel]
  end
end

Message.create(user: users[2], channel: channels[0], content: 'Initial Message')
Message.create(user: users[3], channel: channels[0], reply_to: Message.first, content: 'Reply to Initial Message')
