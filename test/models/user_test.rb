require 'test_helper'

class UserTest < ActiveSupport::TestCase
  fixtures :users

  def without_email
    User.new password: 'password', password_confirmation: 'password'
  end

  def without_password
    User.new email: Faker::Internet.email, password_confirmation: 'password'
  end

  def with_wrong_password_confirmation
    User.new email: Faker::Internet.email, password: 'password', password_confirmation: 'wrong'
  end

  def with_email_too_long
    without_email.tap { |u| u.email = Faker::Internet.email(name: Faker::Lorem.characters(number: 255)) }
  end

  def with_existing_email_address
    User.new(email: users(:one).email, password: 'password', password_confirmation: 'password')
  end

  def errors_of model
    model.tap { |m| m.valid? }.errors
  end

  def with_unique_email_and_password
    User.new(email: Faker::Internet.email, password: password = Faker::Internet.password, password_confirmation: password)
  end

  test "user without email is invalid" do
    assert_not without_email.valid?
  end

  test "user without email has `can't be blank` error message" do
    assert_includes errors_of(without_email).messages[:email], "can't be blank"
  end

  test "user without email has `is too short (minimum is 4 characters)` error message" do
    assert_includes errors_of(without_email).messages[:email], "is too short (minimum is 4 characters)"
  end

  test "user without email has `is invalid` error message" do
    assert_includes errors_of(without_email).messages[:email], "is invalid"
  end

  test "user without email has :blank error detail" do
    assert_includes errors_of(without_email).details[:email], { error: :blank }
  end

  test "user without email has :too_short error detail with a :count of 4" do
    assert_includes errors_of(without_email).details[:email], { error: :too_short, count: 4 }
  end

  test "user without email has :invalid error detail with a value of :nil" do
    assert_includes errors_of(without_email).details[:email], { error: :invalid, value: nil }
  end

  test "user without password is invalid" do
    assert_not without_password.valid?
  end

  test "user without password has `can't be blank` error message" do
    assert_includes errors_of(without_password).messages[:password], "can't be blank"
  end

  test "user without password has :blank error detail" do
    assert_includes errors_of(without_password).details[:password], { error: :blank }
  end

  test "user with email longer than 255 characters is invalid" do
    assert_not with_email_too_long.valid?
  end

  test "user with email longer than 255 characters has `is too long (maximum is 255 characters)` error message" do
    assert_includes errors_of(with_email_too_long).messages[:email], "is too long (maximum is 255 characters)"
  end

  test "user without email has :too_long error detail with a :count of 255" do
    assert_includes errors_of(with_email_too_long).details[:email], { error: :too_long, count: 255 }
  end

  test "user with wrong password confirmation is invalid" do
    assert_not with_wrong_password_confirmation.valid?
  end

  test "user with wrong password confirmation has `doesn't match Password` error message" do
    assert_includes errors_of(with_wrong_password_confirmation).messages[:password_confirmation], "doesn't match Password"
  end

  test "user with wrong password confirmation has :confirmation error detail with an :attribute of `Password`" do
    assert_includes errors_of(with_wrong_password_confirmation).details[:password_confirmation], { error: :confirmation, attribute: "Password" }
  end

  test "new user with existing email address is invalid" do
    assert_not with_existing_email_address.valid?
  end

  test "user with existing email address has `has already been taken` error message" do
    assert_includes errors_of(with_existing_email_address).messages[:email], "has already been taken"
  end

  test "user with existing email address has :taken error detail with a :value of the existing email" do
    assert_includes errors_of(with_existing_email_address).details[:email], { error: :taken, value: users(:one).email }
  end

  test "user with unique email, password, and a password confirmation is valid" do
    assert with_unique_email_and_password.valid?
  end

  test "new valid users can be persisted" do
    assert_difference 'User.count', 1 do
      with_unique_email_and_password.save
    end
  end

  test "updating a user's email address to that of another user is invalid" do
    assert_not users(:one).tap { |u| u.email = users(:two).email }.valid?
  end

  test "updating a user's email address to a new unique value is valid" do
    assert users(:one).tap { |u| u.email = Faker::Internet.email(name: :one) }.valid?
  end

  test "updated valid users can be persisted" do
    assert users(:one).tap { |u| u.email = Faker::Internet.email(name: :one) }.save
  end
end
