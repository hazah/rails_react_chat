class User < ApplicationRecord
  has_secure_password

  validates :email,
    presence: true,
    uniqueness: { case_sensitive: false },
    length: { minimum: 4, maximum: 255 },
    format: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/

  has_and_belongs_to_many :channels
end
