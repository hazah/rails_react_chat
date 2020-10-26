require 'test_helper'

class MessagesControllerTest < ActionDispatch::IntegrationTest
  def authenticated_header
    token = Knock::AuthToken.new(payload: { sub: users(:one).id }).token

    {
      'Authorization': "Bearer #{token}",
    }
  end

  test "should get messages for a specified channel" do
    get channel_messages_url(channels(:one).id), headers: authenticated_header, as: :json
    assert_response :success
    assert_equal JSON.parse(@response.body).length, channels(:one).messages.count
  end

  test "should create message in a specified channel if joined" do
    channels(:one).users << users(:one)
    assert_difference('Message.count') do
      post channel_messages_url(channels(:one).id), params: { message: { content: 'content' } }, headers: authenticated_header, as: :json
    end
    assert_response :success
  end

  test "should not create message in a specified channel if not joined" do
    assert_no_difference('Message.count') do
      post channel_messages_url(channels(:one).id), params: { message: { content: 'content' } }, headers: authenticated_header, as: :json
    end
    assert_response :unauthorized
  end

  test "should update message" do
    put message_url(messages(:one).id), params: { message: { content: 'content' } }, headers: authenticated_header, as: :json
    assert_response :success
    assert_equal messages(:one).reload.content, "content"
  end

  test "should destroy message" do
    assert_difference('Message.count', -1) do
      delete message_url(messages(:two).id), params: {}, headers: authenticated_header, as: :json
    end
    assert_response :success
  end

end
