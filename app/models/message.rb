class Message < ApplicationRecord
  belongs_to :user
  belongs_to :channel
  belongs_to :reply_to, class_name: "Message", optional: true
end
